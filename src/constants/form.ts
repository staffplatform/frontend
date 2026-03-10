const INPUT_TYPES = {
    DATE: "date",
    TEXT: "text",
    EMAIL: "email",
    PASSWORD: "password",
    CHECKBOX: "checkbox",
    NUMBER: "number",
    FILE: "file"
} as const;

export type InputType =
    (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];