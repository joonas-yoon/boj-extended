async function extendNotificationsPage() {
  // TODO: save cache in local storage
  const currentId = getMyUsername();
  const problemsInfo = await fetchProblemsByUser(currentId);
  if (problemsInfo) {
    // coloring
    const container = document.getElementById('notifications');
    container.querySelectorAll('a[href^="/problem/"]').forEach((el) => {
      el.classList.add(problemsInfo[getLastNumberFromHref(el.href)]);
    });
  }
}
