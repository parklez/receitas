const GITHUB_OWER = "parklez";
const GITHUB_REPO = "receitas";
const GITHUB_DIR = "recipes";

async function listGitHubRepoFiles(repoOwner, repoName, dirPath) {
  const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${dirPath}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch directory contents: ${response.statusText}`);
  }

  const files = await response.json();
  return files.map(file => file.name);
}

async function fetchGitHubRepoFile(repoOwner, repoName, filePath) {
  const response = await fetch(`https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${filePath}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  return await response.text();
}

async function loadRecipes() {
  try {
    // const files = await fetchFiles();
    const files = await listGitHubRepoFiles(GITHUB_OWER, GITHUB_REPO, GITHUB_DIR);
    if (files.length === 0) {
      console.warn("No files found in posts folder");
      return;
    }

    const sortedFiles = files.sort((a, b) => a.localeCompare(b));
    const postsContainer = document.getElementById("posts-container");

    for (const file of sortedFiles) {
      if (file.endsWith(".md")) {
        await appendMarkdownFile(postsContainer, file);
      }
    }
  } catch (error) {
    console.warn("Error loading posts:");
    console.error(error);
  }
}

async function appendMarkdownFile(container, file) {
  const content = await fetchGitHubRepoFile(GITHUB_OWER, GITHUB_REPO, `${GITHUB_DIR}/${file}`);
  const postDiv = document.createElement("div");
  postDiv.innerHTML = marked.parse(content);
  postDiv.classList = "box";
  container.appendChild(postDiv);
}

(async () => {
  await loadRecipes();
})();
