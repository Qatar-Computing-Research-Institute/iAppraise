#!/bin/bash

##Installing latest version of eyetracking device

sudo apt-get install git python-pip python-nltk
sudo pip install Django==1.4.10



##clone
git clone https://github.com/Qatar-Computing-Research-Institute/iAppraise Appraise-Software



#Initialize Appraise
cd Appraise-Software/appraise
python manage.py syncdb

