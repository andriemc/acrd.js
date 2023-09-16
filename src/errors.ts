export default class AccordError extends Error {
	message: string = "An error occoured with accord.";
}

export class MissingTokenError extends AccordError {
	message: string = "A token is required.";
}

export class InvalidTokenError extends AccordError {
	message: string = "The provided token is invalid.";
}
