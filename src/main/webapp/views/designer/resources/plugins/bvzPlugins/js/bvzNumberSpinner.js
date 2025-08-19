/**
 * Copyright © 2015-2020 BDB (BizViz Technologies Pvt Ltd). All Rights Reserved
 * @File: bvzNumberSpinner.js
 * @description Numeric Stepper in Property palettes
 */
( function() {
    "use strict";
    
    angular.module( "bvz.numberspinner", [] )
    .directive( "bvzNumberSpinner", [ "$document", "$timeout", function( $document, $timeout ) {
        var
        
        linkFn = function( $scope, $element, $attributes, $controller ) {
            var 
            initSettings = function() {
                if( $scope.bvzMax !== "" && typeof( $scope.bvzMax ) === "string" ) {
                    $scope.bvzMax *= 1;
                }
                if( $scope.bvzMin !== "" && typeof( $scope.bvzMin ) === "string" ) {
                    $scope.bvzMin *= 1;
                }
                if( $scope.ngModel !== "" && typeof( $scope.ngModel ) === "string" ) {
                    $scope.ngModel  *= 1;
                }
                if( $scope.bvzStep !== "" && typeof( $scope.bvzStep ) === "string" ) {
                    $scope.bvzStep *= 1;
                }
                if( $scope.bvzDisable !== "" && typeof( $scope.bvzDisable ) === "string" ) {
                    $scope.bvzDisable *= 1;
                }
            },
            onKeyDown = function( e ) {
                var keyCode = "",
	                KEY_CODE = {
	                    UP_ARROW: 38,
	                    DOWN_ARROW: 40
	                };
                /** This variable only initialize when stepper really changes otherwise it will undefined */
                $scope.stepperChange = true;
                if( e ) {
                    keyCode = e.which ? e.which : e.keyCode;
                }
                switch( keyCode ) {
                    case KEY_CODE.UP_ARROW:
                        e.preventDefault();
                        increaseValue();
                        break;
                    case KEY_CODE.DOWN_ARROW:
                        e.preventDefault();
                        decreaseValue();
                        break;
                    default:
                        break;
                }
            },
            increaseValue = function() {
                var tempVal,
                tempStep = ($scope.bvzStep) ? $scope.bvzStep : 1,
                temp = ($scope.bvzStep) ? $scope.bvzStep.toString().split( "." )[ 1 ] : undefined ,
                dpCount =  (temp) ? temp.length : 0; 
                $scope.ngModel = ( isNaN($scope.ngModel) ) ? 0 : $scope.ngModel ;
                /** This variable only initialize when stepper really changes otherwise it will undefined */
                $scope.stepperChange = true;
                
                if( $scope.bvzMax !== undefined && $scope.bvzMax !== "" ) {
                    if( $scope.ngModel < $scope.bvzMax ) {
                        tempVal = $scope.ngModel * 1 + tempStep * 1;
                        $scope.ngModel = tempVal.toFixed( dpCount ) * 1;
                    }
                }else {
                    tempVal = $scope.ngModel * 1 + tempStep * 1;
                    $scope.ngModel = tempVal.toFixed( dpCount ) * 1;
                }
            },
            decreaseValue = function() {
                var tempVal, 
                tempStep = ($scope.bvzStep) ? $scope.bvzStep : 1,
                temp = ($scope.bvzStep) ? $scope.bvzStep.toString().split( "." )[ 1 ] : undefined ,
                dpCount =  (temp) ? temp.length : 0; 
                $scope.ngModel = ( isNaN($scope.ngModel) ) ? 0 : $scope.ngModel ;
                /** This variable only initialize when stepper really changes otherwise it will undefined */
                $scope.stepperChange = true;
                
                if( $scope.bvzMin !== undefined && $scope.bvzMin !== "" ) {
                    if( $scope.ngModel > $scope.bvzMin ) {
                        tempVal = $scope.ngModel * 1 - tempStep * 1;
                        $scope.ngModel = tempVal.toFixed( dpCount ) * 1;
                    }
                } else {
                    tempVal = $scope.ngModel * 1 - tempStep * 1;
                    $scope.ngModel = tempVal.toFixed( dpCount ) * 1;
                }
            }
            $scope.changeValue = function( e, btn ) {
                var input = $( e.target ).parent().parent().find( "input" );
                if( !input.hasClass( ":focus" ) ) {
                    $timeout( function() {
                        input.focus();
                    }, 1 );
                }
                switch( btn ) {
                    case "UP":
                        increaseValue();
                        break;
                    case "DOWN":
                        decreaseValue();
                        break;
                    default:
                        break;
                }
            }
            $scope.$watch( "ngModel", function( newValue, oldValue ) {
                var regEx = /^-?\d*\.?\d*$/;
                if( !regEx.test( newValue ) ||  ( $scope.bvzMax !== "" && newValue > $scope.bvzMax ) || ( $scope.bvzMin !=="" && newValue < $scope.bvzMin )  ) {
//                  It'll allow only numbers as input
                    $scope.ngModel = oldValue;
                }
                
                $scope.ngModel *= 1;
                /** 
                 * This ng-change is calling eveytime spinner loads. 
                 * It should trigger ng-change only when stepper really changes 
                 * */
                if ($scope.stepperChange) { //This condition stop triggering ngChange when property pellet initialize
                	$scope.stepperChange = false;
                	if(newValue != oldValue){
	                	$scope.ngChange();
	                }
                }
            } );
            
            $element.find( "input" )
            .on( "focus", function( e ) {
                $( this ).parent().parent().find( ".b-n-s-buttons" ).addClass( "btn-visible" );
            } )
            .on( "blur", function( e ) {
                $( this ).parent().parent().find( ".b-n-s-buttons" ).removeClass( "btn-visible" );
            } )
            .on( "keydown", function( e ) {
               onKeyDown( e );
            } )
            .on( "mousewheel DOMMouseScroll", function( e ) {
            	if(IsBoolean($scope.bvzDisable)){
            		/**do nothing when bvzDisable=1*/
            	}else{
            		e.preventDefault();
                    var delta = e.originalEvent.detail ? e.originalEvent.detail * -1: e.originalEvent.detail || e.originalEvent.wheelDelta;
                    if( delta > 0 ) {
                        increaseValue();
                    }
                    else {
                        decreaseValue();
                    }
                    $scope.$apply();
            	}
            } );
            initSettings();
        },
        compileFn = function() {
            return linkFn;
        };
        return {
            restrict: "E",
            replace: true,
            translate: false,
            templateUrl: "./resources/plugins/bvzPlugins/template/bvzNumberSpinner.html",
            scope: {
                ngModel: "=",
                ngChange: "&",
                bvzDisable:"=?bvzDisable",
                bvzMax: "=",
                bvzMin: "=",
                bvzStep: "="
            },
            require: "ngModel",
            compile: compileFn
        }
        
    } ] );
} )();