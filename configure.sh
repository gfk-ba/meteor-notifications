#!/bin/sh

#install meteor
curl https://install.meteor.com | /bin/sh

cd ..
mv meteor-notifications gfk:notifications
cd gfk:notifications
