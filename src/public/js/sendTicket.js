const ticketBtn = document.querySelector(".email-button");
ticketBtn.addEventListener("click", async () => {
	const ticketId = ticketBtn.getAttribute("data-ticket");

	try {
		const response = await fetch(`/api/ticket/send-ticket-email/${ticketId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		// Check if the response is successful (you can modify this condition based on your API response structure)
		if (response.ok) {
			Swal.fire({
				icon: "success",
				title: "Email Sent!",
				text: "The email has been sent successfully.",
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Failed to send email. Please try again.",
			});
		}

		console.log(data);
	} catch (error) {
		console.error("Error fetching data:", error);

		// Show an error alert if there is an issue with the fetch request
		Swal.fire({
			icon: "error",
			title: "Error",
			text: "Failed to fetch data. Please try again.",
		});
	}
});