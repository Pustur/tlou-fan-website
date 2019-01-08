# The Last of Us — Fan Website

> A fanmade website that pays homage to my favourite game of all time: The Last of Us

## Technologies

- HTML5
- CSS
- JavaScript (with jQuery)
- Gulp
- Babel
- Eslint / Stylelint

## Instructions

You'll need `node` and `gulp` to run and compile the project.  
A node version too high will break the build, so I found that node `6.x.x` works.

If you use `nvm`, just run:

```bash
$ nvm install
```
to install a suitable version of node.

Then, you should install the gulp-cli using:

```bash
$ npm install -g gulp-cli
```

Almost there, now install all dependencies with:

```bash
$ npm install
```

And finally run:

```bash
$ gulp
```

To compile and serve the files at [localhost:8000](http://localhost:8000/).

For an optimized production build, run the following command:

```bash
$ gulp --production
```
