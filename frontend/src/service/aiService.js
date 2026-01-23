export const getAIVideo = async (payload) => {
  const response = await fetch("http://localhost:5000/api/ai/generate-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch AI video");
  }

  return response.json();
};
