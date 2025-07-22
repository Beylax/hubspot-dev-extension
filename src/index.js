function updateQueryParams(url, paramsToAdd) {
	const urlObj = new URL(url);
	const params = urlObj.searchParams;

	for (const [key, value] of Object.entries(paramsToAdd)) {
		if (value === null) {
			params.set(key, Math.floor(Math.random() * 1e16));
		} else {
			params.set(key, value);
		}
	}

	urlObj.search = params.toString();
	return urlObj.toString();
}

async function modifyUrl(paramsToAdd) {
	const [tab] = await chrome.tabs.query({
		active: true,
		currentWindow: true,
	});

	if (!tab.url.startsWith("http")) return;

	const newUrl = updateQueryParams(tab.url, paramsToAdd);
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		func: (url) => {
			window.location.href = url;
		},
		args: [newUrl],
	});
}

document.getElementById("debugBtn").addEventListener("click", () => {
	modifyUrl({ hsDebug: "true", hsCacheBuster: null });
});

document.getElementById("devBtn").addEventListener("click", () => {
	modifyUrl({ developerMode: "true" });
});
