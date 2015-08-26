
all: css
pre-commit: css
	@git add stylesheet.css

css: stylesheet.css

%.css: %.less
	lessc $^ > $@

