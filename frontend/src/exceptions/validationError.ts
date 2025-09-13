// export default class ValidationError {
//     messages : {}

//     constructor(messages : {}) {
//         this.messages = messages;
//     }
// }


export default class ValidationError {
    messages: Record<string, string>;

    constructor(messages: Record<string, string>) {
        this.messages = messages;
    }
}
