import { Bookmark } from './bookmark';

export class Category {
    public bucketname: string;
    public bookmarks: Array<Bookmark> = [];
    public uuid: string;
}