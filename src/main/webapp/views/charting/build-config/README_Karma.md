# Running UI Tests with Karma Jasmine for BizViz Dashboard Designer

This guide provides detailed steps to set up and run UI tests for the BizViz Dashboard Designer project using Karma/Jasmine with Grunt.

---

## Prerequisites

Make sure you have the following installed:
- Node.js and npm
- Grunt CLI (`npm install -g grunt-cli`)

---

## 1. Install Karma and Required Packages

Run the following command in the project root:

```bash
npm install --save-dev karma karma-cli grunt-karma karma-jasmine jasmine-core karma-chrome-launcher karma-coverage karma-webpack karma-sourcemap-loader
```

---

## 2. Create Karma Configuration File

Create a `karma.conf.js` file in your project root:

```js
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['src/**/*.spec.js'],
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap']
    },
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          }
        ]
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: Infinity
  });
};
```

---

## 3. Update Gruntfile to Support Karma

In `Gruntfile.js`, add the following configuration:

```js
grunt.initConfig({
  karma: {
    unit: {
      configFile: 'karma.conf.js'
    }
  }
});

grunt.loadNpmTasks('grunt-karma');
grunt.registerTask('test', ['karma']);
```

---

## 4. Add Sample Test

Create a test file like `src/components/example.spec.js`:

```js
describe('Example Component', () => {
  it('should pass this sample test', () => {
    expect(true).toBe(true);
  });
});
```

---

## 5. Run Tests

Execute this command to run your Karma tests via Grunt:

```bash
grunt test
```

You should see test results in the terminal, and a coverage report in the `coverage/` directory.

---

For more help, visit the [Karma documentation](https://karma-runner.github.io/).

## Authors
1. Laxman K D