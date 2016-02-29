# Reactive Retro Backend [![Build Status](https://travis-ci.org/seiyria/bootstrap-slider.svg?branch=master)](https://travis-ci.org/seiyria/bootstrap-slider)

This is the backend service for Reactive Retro.

# Setup

* Install node v4.2.2
* Run `npm install`
* Set up your environment with these variables:
  * `MONGOLAB_URI` - a full uri that can connect to an existing mongodb instance. If you don't want to use MongoLab, this can be a link to a local mongodb instance, instead.
  * `AUTH0_SECRET` - a secret key for an auth0 instance. You need this to authenticate.
  * `GOOGLE_PLACES_API_KEY` - a Google Places API key, needed to get place instances from Google.
  
* Setting up Auth0:
  * Create a new application
  * Add `http://retro:8100` to your `Allowed Origins` block (if you set up `retro` as an alias in the app setup, otherwise add your ip address).
