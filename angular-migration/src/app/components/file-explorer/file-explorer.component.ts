import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTreeModule, MatTreeNestedDataSource, MatNestedTreeNode } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { DesignerService } from '../../services/designer.service';

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  isChildPresent: boolean;
  nodes: FileNode[];
  parent?: string;
  path?: string;
  size?: number;
  modifiedDate?: Date;
  isSelected?: boolean;
  isExpanded?: boolean;
}

export interface DirectoryStructure {
  [key: string]: FileNode[];
}

@Component({
  selector: 'app-file-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit, OnDestroy {
  @Input() rootPath = '/';
  @Input() allowFileUpload = true;
  @Input() allowFolderCreation = true;
  @Input() maxFileSize = 10 * 1024 * 1024; // 10MB
  @Output() fileSelected = new EventEmitter<FileNode>();
  @Output() folderSelected = new EventEmitter<FileNode>();
  @Output() fileUploaded = new EventEmitter<FileNode>();

  // Component state
  dataSource = new MatTreeNestedDataSource<FileNode>();
  selectedNode: FileNode | null = null;
  isLoading = false;
  errorMessage = '';

  // Directory management
  dirStrBackup: DirectoryStructure = {};
  newDirName = 'New folder';
  isCreatingFolder = false;
  currentPath = '/';

  // File upload
  dragOver = false;
  uploadProgress = 0;
  isUploading = false;

  // Search and filter
  searchTerm = '';
  filterType: 'all' | 'files' | 'folders' = 'all';

  private destroy$ = new Subject<void>();

  constructor(
    private designerService: DesignerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource.data = [];
  }

  ngOnInit(): void {
    this.initializeFileExplorer();
    this.loadDirectoryStructure();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize file explorer
   */
  private initializeFileExplorer(): void {
    // Set up initial directory structure
    this.selectedNode = {
      id: '0',
      name: 'Home',
      type: 'folder',
      isChildPresent: true,
      nodes: []
    };
  }

  /**
   * Load directory structure from server
   */
  private loadDirectoryStructure(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.designerService.get('/files/directory-structure')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dirStrBackup = response.directories || {};
          this.updateDataSource();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to load directory structure';
          this.isLoading = false;
          this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Update data source with current directory structure
   */
  private updateDataSource(): void {
    const rootNodes = this.dirStrBackup[this.currentPath] || [];
    this.dataSource.data = rootNodes;
  }

  /**
   * Check if node has children
   */
  hasChild = (_: number, node: FileNode): boolean => {
    return node.isChildPresent && node.nodes && node.nodes.length > 0;
  };

  /**
   * Get node icon based on type
   */
  getNodeIcon(node: FileNode): string {
    if (node.type === 'folder') {
      return node.isExpanded ? 'folder_open' : 'folder';
    }
    
    // File type icons based on extension
    const extension = this.getFileExtension(node.name);
    switch (extension.toLowerCase()) {
      case '.json':
        return 'code';
      case '.png':
      case '.jpg':
      case '.jpeg':
      case '.gif':
        return 'image';
      case '.pdf':
        return 'picture_as_pdf';
      case '.txt':
        return 'description';
      default:
        return 'insert_drive_file';
    }
  }

  /**
   * Get file extension
   */
  private getFileExtension(filename: string): string {
    return filename.substring(filename.lastIndexOf('.'));
  }

  /**
   * Select a node
   */
  selectNode(node: FileNode): void {
    this.selectedNode = node;
    
    if (node.type === 'file') {
      this.fileSelected.emit(node);
    } else {
      this.folderSelected.emit(node);
      this.expandNode(node);
    }
  }

  /**
   * Expand a folder node
   */
  expandNode(node: FileNode): void {
    if (node.type === 'folder' && !node.isExpanded) {
      node.isExpanded = true;
      this.loadChildNodes(node);
    }
  }

  /**
   * Load child nodes for a folder
   */
  private loadChildNodes(parentNode: FileNode): void {
    const parentPath = parentNode.path || parentNode.id;
    
    this.designerService.get(`/files/children/${parentPath}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          parentNode.nodes = response.children || [];
          parentNode.isChildPresent = parentNode.nodes.length > 0;
          this.updateDataSource();
        },
        error: (error) => {
          console.error('Failed to load child nodes:', error);
          this.snackBar.open('Failed to load folder contents', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Go to create directory mode
   */
  goToCreateDirMode(): void {
    if (!this.allowFolderCreation) {
      this.snackBar.open('Folder creation is not allowed', 'Close', { duration: 3000 });
      return;
    }
    
    this.isCreatingFolder = true;
    this.newDirName = 'New folder';
    
    // Focus on input after view update
    setTimeout(() => {
      const input = document.querySelector('.new-dir-input') as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  /**
   * Create new directory
   */
  createNewDir(parentDir?: FileNode): void {
    const dirTitle = this.newDirName.trim();
    
    if (!dirTitle) {
      this.snackBar.open('Folder name cannot be empty', 'Close', { duration: 3000 });
      return;
    }

    const parentId = parentDir?.id || this.selectedNode?.id || '0';
    const currentTime = new Date().toString();
    
    const requestData = {
      position: '0',
      type: 'folder',
      parentid: parentId,
      dashboardtype: '0',
      id: '0',
      imagename: 'dashboard.png',
      title: dirTitle,
      description: `Created from dashboard designer on ${currentTime}`,
      file: ''
    };

    this.designerService.post('/files/create-directory', requestData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            const newlyCreatedDir: FileNode = {
              id: response.tree.id,
              name: response.tree.title,
              type: 'folder',
              isChildPresent: false,
              nodes: [],
              parent: parentId
            };

            // Add to directory structure
            if (!this.dirStrBackup[parentId]) {
              this.dirStrBackup[parentId] = [];
            }
            this.dirStrBackup[parentId].push(newlyCreatedDir);
            
            this.updateDataSource();
            this.isCreatingFolder = false;
            this.newDirName = 'New folder';
            
            this.snackBar.open('Folder created successfully', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Failed to create folder', 'Close', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Failed to create directory:', error);
          this.snackBar.open('Failed to create folder', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Cancel folder creation
   */
  cancelCreateDir(): void {
    this.isCreatingFolder = false;
    this.newDirName = 'New folder';
  }

  /**
   * Update selected directory
   */
  updateSelectedDir(dir: FileNode): void {
    this.selectedNode = dir;
    this.folderSelected.emit(dir);
  }

  /**
   * Delete a file or folder
   */
  deleteNode(node: FileNode): void {
    const nodeType = node.type === 'folder' ? 'folder' : 'file';
    const confirmMessage = `Are you sure you want to delete this ${nodeType}?`;
    
    if (confirm(confirmMessage)) {
      this.designerService.delete(`/files/${node.id}`)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            // Remove from directory structure
            this.removeNodeFromStructure(node);
            this.updateDataSource();
            
            if (this.selectedNode?.id === node.id) {
              this.selectedNode = null;
            }
            
            this.snackBar.open(`${nodeType} deleted successfully`, 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error(`Failed to delete ${nodeType}:`, error);
            this.snackBar.open(`Failed to delete ${nodeType}`, 'Close', { duration: 3000 });
          }
        });
    }
  }

  /**
   * Remove node from directory structure
   */
  private removeNodeFromStructure(node: FileNode): void {
    const parentId = node.parent || '0';
    if (this.dirStrBackup[parentId]) {
      this.dirStrBackup[parentId] = this.dirStrBackup[parentId].filter(n => n.id !== node.id);
    }
  }

  /**
   * Handle file upload
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    
    if (files && files.length > 0) {
      this.uploadFiles(Array.from(files));
    }
  }

  /**
   * Handle drag and drop
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFiles(Array.from(files));
    }
  }

  /**
   * Upload files
   */
  private uploadFiles(files: File[]): void {
    if (!this.allowFileUpload) {
      this.snackBar.open('File upload is not allowed', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    this.uploadProgress = 0;

    const parentId = this.selectedNode?.id || '0';
    const formData = new FormData();
    
    files.forEach(file => {
      if (file.size > this.maxFileSize) {
        this.snackBar.open(`File ${file.name} is too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`, 'Close', { duration: 5000 });
        return;
      }
      formData.append('files', file);
    });

    formData.append('parentId', parentId);

    this.designerService.post('/files/upload', formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isUploading = false;
          this.uploadProgress = 100;
          
          // Add uploaded files to directory structure
          if (response.files) {
            response.files.forEach((fileData: any) => {
              const fileNode: FileNode = {
                id: fileData.id,
                name: fileData.name,
                type: 'file',
                isChildPresent: false,
                nodes: [],
                parent: parentId,
                size: fileData.size,
                modifiedDate: new Date(fileData.modifiedDate)
              };
              
              if (!this.dirStrBackup[parentId]) {
                this.dirStrBackup[parentId] = [];
              }
              this.dirStrBackup[parentId].push(fileNode);
              this.fileUploaded.emit(fileNode);
            });
            
            this.updateDataSource();
          }
          
          this.snackBar.open('Files uploaded successfully', 'Close', { duration: 3000 });
          
          // Reset progress after delay
          setTimeout(() => {
            this.uploadProgress = 0;
          }, 2000);
        },
        error: (error) => {
          this.isUploading = false;
          this.uploadProgress = 0;
          console.error('Upload failed:', error);
          this.snackBar.open('Upload failed', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Search files and folders
   */
  searchFiles(): void {
    if (!this.searchTerm.trim()) {
      this.updateDataSource();
      return;
    }

    this.designerService.get('/files/search', { query: this.searchTerm, type: this.filterType })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.results || [];
        },
        error: (error) => {
          console.error('Search failed:', error);
          this.snackBar.open('Search failed', 'Close', { duration: 3000 });
        }
      });
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filterType = 'all';
    this.updateDataSource();
  }

  /**
   * Get file size in human readable format
   */
  getFileSize(size: number): string {
    if (size === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get formatted date
   */
  getFormattedDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  /**
   * Navigate to parent directory
   */
  navigateToParent(): void {
    if (this.selectedNode?.parent) {
      const parentNode = this.findNodeById(this.selectedNode.parent);
      if (parentNode) {
        this.selectNode(parentNode);
      }
    }
  }

  /**
   * Find node by ID in the directory structure
   */
  private findNodeById(id: string): FileNode | null {
    for (const path in this.dirStrBackup) {
      const nodes = this.dirStrBackup[path];
      const node = nodes.find(n => n.id === id);
      if (node) return node;
    }
    return null;
  }
}