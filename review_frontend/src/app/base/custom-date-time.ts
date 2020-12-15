import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "customDateTime" })

export class customDateTime implements PipeTransform {

    constructor() { }

    transform(value: any) {
        let datetime = (new Date(value)).toLocaleTimeString();
        let hour = Number((datetime.split(':'))[0]);
        let minute = Number((datetime.split(':'))[1]);
        let second = Number((datetime.split(':'))[2]);
        let type = (hour < 12) ? " AM" : " PM";
        
        hour = (hour % 12 || hour);
        hour = hour == 0 ? 12 : hour;

        let time = (hour < 10 ? `0${hour}` : hour) + ":" + (minute < 10 ? `0${minute}` : minute) + type;
        let date = (new Date(value)).toDateString();
        return date+" "+time;
    }
}

