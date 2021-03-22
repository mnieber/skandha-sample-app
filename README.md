# SkandhaJS sample applications

This repository contains sample applications that use the SkandhaJS library:

- bulky: this is a self-contained application that creates skandha behaviours from
  scratch. It gives insight into the skandha principles, but because it does not use ready-made
  behaviours from a library the code is quite bulky.
- realistic: this version uses behaviours from [skandha-facets](http://github.com/mnieber/skandha-facets).
  It shows how reusable behaviours can lead to compact code that does not reinvent the wheel.
  Moreover, it shows the ClickToSelectItems and SelectWithKeys handlers from
  [skandha-facets](http://github.com/mnieber/skandha-facets) (try it out by using the up and down keys,
  using the shift key to extend the selection).

## Running the bulky sample

```
cd bulky
docker-compose up
# open a browser at localhost:3000
```

## Running the realistic sample

```
cd realistic
docker-compose up
# open a browser at localhost:3000
```
