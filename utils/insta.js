export const getConversationId = async (user_id) => {
  const url = `https://graph.facebook.com/v17.0/me/conversations?platform=instagram&user_id=${user_id}`;

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OURBABYPICS_ACCESS_TOKEN}`,
    },
  };

  return fetch(url, config)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && data.data && data.data.length > 0) {
        return data.data[0].id;
      } else {
        throw new Error("No conversation found");
      }
    })
    .catch((error) => {
      console.error("Error fetching conversation ID:", error);
      throw error;
    });
};
