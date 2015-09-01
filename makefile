
all: css

css: stylesheet.css

%.css: %.less
	lessc $^ > $@
	echo >> $@

