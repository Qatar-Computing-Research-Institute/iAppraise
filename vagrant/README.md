#Create VM folder
mkdir appraise-vm
cd appraise-vm


# Copy init files

cp bootstrap.sh Vagrantfile runappraise.sh appraise-vm


#Start vagrant

vagrant init
vagrant up


#This will install all the packages required (look out for errors)

#Log in via ssh

vagrant ssh

#Once in the VM you should run
bash /shared/runappraise.sh 

#now connect through your browser to:
open http://localhost:8000/

