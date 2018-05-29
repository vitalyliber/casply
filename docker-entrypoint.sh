#!/bin/bash
set -e
echo App will be setup!

rake db:create db:migrate RAILS_ENV=production

echo App successfully configured!

exec "$@"