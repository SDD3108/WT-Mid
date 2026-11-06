const feedbackForm = document.querySelector("#feedback-form");
const successMessage = document.querySelector("#feedback-success");

const fields = {
    name: document.querySelector("#feedback-name"),
    email: document.querySelector("#feedback-email"),
    genre: document.querySelector("#feedback-genre"),
    rating: document.querySelector("#feedback-rating"),
    message: document.querySelector("#feedback-message")
};

function showError(fieldName, message) {
    const field = fields[fieldName];
    const errorElement = document.querySelector(`#${fieldName}-error`);

    errorElement.textContent = message;
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
}

function clearError(fieldName) {
    const field = fields[fieldName];
    const errorElement = document.querySelector(`#${fieldName}-error`);

    errorElement.textContent = "";
    field.classList.remove("is-invalid");
    field.setAttribute("aria-invalid", "false");
}

function getValidationError(fieldName) {
    const value = fields[fieldName].value.trim();

    switch (fieldName) {
        case "name":
            if (!value) return "Name is required.";
            if (value.length < 2) return "Name must have at least 2 characters.";
            return "";

        case "email":
            if (!value) return "Email is required.";

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(value)) {
                return "Enter a valid email address.";
            }
            return "";

        case "genre":
            return value ? "" : "Please select a genre.";

        case "rating":
            if (!value) return "Please select a rating.";

            if (Number(value) < 1 || Number(value) > 5) {
                return "Rating must be between 1 and 5.";
            }
            return "";

        case "message":
            if (!value) return "Feedback message is required.";
            if (value.length < 10) {
                return "Please write at least 10 characters.";
            }
            if (value.length > 500) {
                return "Feedback must not exceed 500 characters.";
            }
            return "";

        default:
            return "";
    }
}

function validateField(fieldName) {
    const error = getValidationError(fieldName);

    if (error) {
        showError(fieldName, error);
        return false;
    }

    clearError(fieldName);
    return true;
}

function validateForm() {
    let isValid = true;

    Object.keys(fields).forEach((fieldName) => {
        if (!validateField(fieldName)) {
            isValid = false;
        }
    });

    return isValid;
}

Object.entries(fields).forEach(([fieldName, field]) => {
    const eventType = field.tagName === "SELECT" ? "change" : "input";

    field.addEventListener(eventType, () => {
        validateField(fieldName);
        successMessage.hidden = true;
    });
});

feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    successMessage.hidden = true;

    if (!validateForm()) {
        const firstInvalid = feedbackForm.querySelector(".is-invalid");
        firstInvalid?.focus();
        return;
    }

    successMessage.textContent =
        "Thank you for your feedback!";

    successMessage.hidden = false;
    feedbackForm.reset();

    Object.keys(fields).forEach(clearError);
});