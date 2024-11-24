# Welcome BeautySpace Repository

This project aims to simplify and guide the way begineers make their first contribution. If you looking to make your first contribution follow this steps.

If you are not good with command line, [Command Line](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line)

You can learn about git if you don't know about it enough [here](Link)

## Clone the repo 

You need to clone the repository to your computer using the below command line in your terminal:

> git clone https://github.com/mercyharbo/camc-frontend.git

## Starting your app

Now that you have clone the repo, you will need to run the command below in order to install all the neccsary dependencies used for this webpack to get it working on your computer...

> npm install

After installing all the dependencies, you can start the app by running the command:

> npm start

## Ceeate a branch 

Create a branch after cloning the repository, but you need to cd into the cloned repository folder by using the command below:

> cd camc-frontend

Now create a branch using the == git checkout == command

> git checkout -b branch-name

For example: if you working on an epic task, you are to use the following branch name as below

> git checkout -b Feat/CAMC-20/Workflow 

or this if you are fixing a bug as identify below:

> git checkout -b BugFix/CAMC-20/Fix-Nav


You are to run this command once you are ready to add all your changes:

> git add .

or use the below command to add just only the file you will like you push only

> git add filename

For example: 

> git add README.md

Now commit those changes using the == git commit == command:

> git commit -m "Add your commit description here" 

## Push changes to GitHub

Push your changes to the GitHub repo using the git push command: 

> git push -u origin branch-name

For example: 

git push -u origin Feat/CAMC-20/Workflow

## Submit your change for review 

if you go to your repo on GitHub after pushing your code successfully, you'll see a == Compare and pull request == button at the top of your fork repo, click on the button and the == create pull request == to submit a PR (pull request) for review. 

You'll get merged of all your changes once the manager is satisfy with it and you will get notification email once the changes has been merged.
