

# viewport-units-cross-browser

> Cross-Browser CSS3 Viewport Units : vh, vw, vmin, vmax

Current library allows you tu use CSS3 Viewport units in all browsers. Are supported styles that are included in ``<style>`` tag.


## Including library


Add library's script
```html
<script src="viewport-units.js" type="text/javascript"></script>
```

and initialize library

```html
<script type="text/javascript">
	// it will check code in realtime
	viewportUnits.init({
		// default 900ms
		// and on orintationchange and resize events
		refresh		: 1000,
		// stop viewportUnits support on css error
		// default false
		onErrorStop	: false
	});
</script>
```

### Important marks

Add ``application-style="viewport-units"`` attribute to style element.

```html
<style type="text/css" application-style="viewport-units">

</style>
```

## Other methods for viewportUnits Library

### Config viewportUnits in separate method

```html
<script type="text/javascript">
	viewportUnits.config({
		refresh	: 250,
		onErrorStop	: false
	})
</script>
```

### Run it exactly when you want

```html
<script type="text/javascript">
	viewportUnits.run()
</script>
```

### Control service start/stop

```html
<script type="text/javascript">
	// you may start service
	viewportUnits.start();

	// you may start service
	viewportUnits.stop();

	// run it once
	viewportUnits.run();
</script>
```

### Parse a separate CSS code

```html
<script type="text/javascript">
	// return a string
	viewportUnits.updateStyle('a { font-size: 5vmin; }');
</script>
```

### List matched styles for controlling

```html
<script type="text/javascript">
	// returns a list of HTMLElements
	viewportUnits.styles();
</script>
```




## Example of including library into a page

```html
<!DOCTYPE html>
<html>
	<head>
		<title>Viewport units test</title>
		<script src="viewport-units.js" type="text/javascript"></script>
		<script type="text/javascript">
			viewportUnits.init({
				// default 900ms
				// and on orintationchange and resize events
				refresh		: 1000,
				// stop viewportUnits support on css error
				// default false
				onErrorStop	: false
			})
		</script>
		<style type="text/css" application-style="viewport-units">
			html, body {
				background	: #dedede;
				color		: #c0c0c0;
			}

			#message {
				line-height	: 60vh;
				font-size	: 27vh;

				margin-top	: 20vh;

				text-align	: center;
				font-weight	: bold;
			}
		</style>
	</head>
	<body>
		<div id="message">My Message</div>
	</body>
</html>
```