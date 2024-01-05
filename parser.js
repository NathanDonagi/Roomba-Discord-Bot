module.exports = class Parse {
    getSize(message) {
        var text = message.content
        try {
            if (parseInt(text.split("size:")[1].replace(/(^.+)(\w\d+\w)(.+$)/i, '$2')) < 25 && parseInt(text.split("size:")[1].replace(/(^.+)(\w\d+\w)(.+$)/i, '$2')) > 8) {
                return parseInt(text.split("size:")[1].replace(/(^.+)(\w\d+\w)(.+$)/i, '$2'));
            } else {
                message.channel.send("invalid board size, default board selected");
                return 15
            }
        } catch {
            return 15
        }
    }

    getDisplayMode(message) {
        var text = message.content
        try {
            if (text.split("display mode:")[1].split(" ")[0] != "") {
                console.log(text.split("display mode:")[1].split(" ")[0])
                return text.split("display mode:")[1].split(" ")[0]
            } else {
                message.channel.send("invalid display mode, default display mode selected");
                return "newMessage"
            }
        } catch {
            return "newMessage"
        }
    }
    getControlMode(message) {
        var text = message.content
        try {
            if (text.split("control mode:")[1].split(" ")[0] != "") {
                console.log(text.split("control mode:")[1].split(" ")[0])
                return text.split("control mode:")[1].split(" ")[0]
            } else {
                message.channel.send("invalid control mode, default control mode selected");
                return "newMessage"
            }
        } catch {
            return "newMessage"
        }
    }
}