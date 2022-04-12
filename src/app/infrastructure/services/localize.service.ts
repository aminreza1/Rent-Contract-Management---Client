import { Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalizeService {
    constructor() { }

    static get(){
        var culture = 'en-EN';
        var lang = document.getElementsByTagName('html')[0].getAttribute('lang');
        if (lang && lang == 'en') culture = 'en-EN';
        if (lang && lang == 'fa') culture = 'fa-IR';
        return culture;
    }
    get(){
        var culture = 'en-EN';
        var lang = document.getElementsByTagName('html')[0].getAttribute('lang');
        if (lang && lang == 'en') culture = 'en-EN';
        if (lang && lang == 'fa') culture = 'fa-IR';
        return culture;
    }

}