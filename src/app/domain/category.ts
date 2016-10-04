import { Bookmark } from './bookmark';

export class Category {
    public sidebarUuid: string;
    public uuid: string;
    public bucketname: string;
    public bookmarks: Array<Bookmark> = [];
}