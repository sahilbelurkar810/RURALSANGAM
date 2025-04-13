#!/bin/bash

#!/bin/bash

# Set the branch you want to update,,
# uncomment the target by removing the # in front of it
#TARGET_BRANCH="your branch"

# Set the upstream repo URL (only needed once)
UPSTREAM_URL="git@github.com:sahilbelurkar810/RURALSANGAM.git"

#echo "Switching to $TARGET_BRANCH branch..."
#git checkout $TARGET_BRANCH

# Add upstream remote if not already added
if ! git remote get-url upstream &> /dev/null; then
  echo "Adding upstream remote..."
  git remote add upstream $UPSTREAM_URL
else
  echo "Upstream already exists."
fi

echo "Fetching latest changes from upstream..."
git fetch upstream

echo "Merging upstream/main into $TARGET_BRANCH..."
git merge upstream/main

echo "Pushing changes to origin/$TARGET_BRANCH..."
#git push origin $TARGET_BRANCH
#if you are already in your target branch do this
git push
echo "✅ Branch  synced with upstream/main!"

