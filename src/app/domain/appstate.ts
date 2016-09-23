export class AppState {
    public state: string  = "inactive";

    toggleState() {
        if (this.state == "inactive") {
            this.state = "active";
        } else {
            this.state = "inactive";            
        }
    }
 }