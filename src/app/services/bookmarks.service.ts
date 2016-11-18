import { Injectable } from "@angular/core";
import { Bookmark } from '../domain/bookmark';
import { UUID } from 'angular2-uuid';

declare var AWS: any;

@Injectable()
export class BookmarksService {

    static getBookmarks(id: string, mapArray: Array<any>) {
        var params = {
            TableName: 'bookmark',
            KeyConditionExpression: "sidebarUUID = :sidebarUUID",
            ExpressionAttributeValues: {
                ":sidebarUUID": id
            }
        };
        new AWS.DynamoDB.DocumentClient().query(params, function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    if (logitem.bookmarks == null) {
                        mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid });
                    } else {
                        mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid, bookmarks: JSON.parse(logitem.bookmarks) });
                    }
                });
            }
        });
    }

    static getBookmarksForCategory(catId: string, mapArray: Array<any>) {
        var params = {
            TableName: 'bookmark',
            FilterExpression: "#theId = :uuid",
            ExpressionAttributeNames: {
                "#theId": "uuid"
            },
            ExpressionAttributeValues: {
                ":uuid": catId
            }
        };
        new AWS.DynamoDB.DocumentClient().scan(params, function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
                return;
            }
            if (data.Items.length == 0) {
                return;
            }
            var bookmarks = JSON.parse(data.Items[0].bookmarks);
            if (bookmarks == null) {
                return;
            }
            for (var i = 0; i < bookmarks.length; i++) {
                mapArray.push(bookmarks[i]);
            };

        });
    }

}