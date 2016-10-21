import { Injectable } from "@angular/core";
//import { CognitoUtil, UserLoginService, Callback } from "./cognito.service";
//import { Stuff } from "../secure/useractivity.component";
import { Sidebar } from "../domain/sidebar";
import { Category } from "../domain/category";

import { UUID } from 'angular2-uuid';

declare var AWS: any;

@Injectable()
export class DynamoDBService {

    public static DDB: any;

    // --- sidebars ------------------------------------------

    static getSidebars(id: string, mapArray: Array<Sidebar>) {
        var params = {
            TableName: 'sidebar',
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": id
            }
        };
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    mapArray.push({ sidebarName: logitem.sidebarName, uuid: logitem.uuid, userId: logitem.userId });
                });
            }
        }
    }

    static getSidebars2(id: string, onQuery: any) {
        var params = {
            TableName: 'sidebar',
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": id
            }
        };
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);
    }
    
    static createSidebar(userId: string, newSidebar: Sidebar) {
        console.log("creating sidebar " + name);
        DynamoDBService.DDB = new AWS.DynamoDB({
            params: { TableName: 'sidebar' }
        });

        // Write the item to the table
        var itemParams =
            {
                Item: {
                    userId: { S: userId },
                    sidebarName: { S: newSidebar.sidebarName },
                    uuid: { S: UUID.UUID() }
                }
            };
        console.log(itemParams);
        DynamoDBService.DDB.putItem(itemParams, function (result) {
            console.log(result);
        });
    }


    // --- categories -----------------------------------------------

    static getCategories(sidebarUUID: string, mapArray: Array<any>) {
        var params = {
            TableName: 'bookmark',
            KeyConditionExpression: "sidebarUUID = :sidebarUUID",
            ExpressionAttributeValues: {
                ":sidebarUUID": sidebarUUID
            }
        };
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid, bookmarks: logitem.bookmarks });
                });
            }
        }
    }

    static getCategories2(sidebarUUID: string, onQuery: any) {
        var params = {
            TableName: 'bookmark',
            KeyConditionExpression: "sidebarUUID = :sidebarUUID",
            ExpressionAttributeValues: {
                ":sidebarUUID": sidebarUUID
            }
        };
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);
    }

    static createCategory(sidebarUuid: string, name: string) {
        console.log("creating category with name " + name);
        DynamoDBService.DDB = new AWS.DynamoDB({
            params: { TableName: 'bookmark' }
        });

        // Write the item to the table
        var itemParams =
            {
                Item: {
                    sidebarUUID: { S: sidebarUuid },
                    bucketname: { S: name },
                    uuid: { S: UUID.UUID() }
                }
            };
        console.log(itemParams);
        DynamoDBService.DDB.putItem(itemParams, function (result) {
            console.log(result);
        });
    }

    static updateCategory(sidebarUuid: string, category: Category) {
        console.log("updating category " + category.uuid);
        console.log("with sidebar " + sidebarUuid);
        console.log(category.bookmarks);
        DynamoDBService.DDB = new AWS.DynamoDB({
            params: { TableName: 'bookmark' }
        });

        // Write the item to the table
        var itemParams =
            {
                Item: {
                    sidebarUUID: { S: sidebarUuid },
                    bucketname: { S: category.bucketname },
                    uuid: { S: category.uuid },
                    bookmarks: { S: JSON.stringify(category.bookmarks) }
                }
            };
        DynamoDBService.DDB.putItem(itemParams, function (result) {
        });
    }

    // --- bookmarks -----------------------------------------------

    static getBookmarks(id: string, mapArray: Array<any>) {
        var params = {
            TableName: 'bookmark',
            KeyConditionExpression: "sidebarUUID = :sidebarUUID",
            ExpressionAttributeValues: {
                ":sidebarUUID": id
            }
        };
        //console.log(params);
        var docClient = new AWS.DynamoDB.DocumentClient();
        docClient.query(params, onQuery);

        function onQuery(err, data) {
            if (err) {
                console.error("Unable to query the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                data.Items.forEach(function (logitem) {
                    console.log(logitem.bookmarks);
                    if (logitem.bookmarks == null) {
                        mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid });
                    } else {
                        mapArray.push({ bucketname: logitem.bucketname, uuid: logitem.uuid, bookmarks: JSON.parse(logitem.bookmarks) });
                    }
                });
            }
        }
    }

    /*static writeLogEntry(type: string) {
        let date = new Date().toString();
        //console.log("Writing log entry..type:" + type + " id: " + AWS.config.credentials.params.IdentityId + " date: " + date);
        DynamoDBService.write(AWS.config.credentials.params.IdentityId, date, type);
    }

    static write(data: string, date: string, type: string): void {
        DynamoDBService.DDB = new AWS.DynamoDB({
            params: { TableName: 'LoginTrail' }
        });

        // Write the item to the table
        var itemParams =
            {
                Item: {
                    userId: { S: data },
                    activityDate: { S: date },
                    type: { S: type }
                }
            };
        DynamoDBService.DDB.putItem(itemParams, function (result) {
        });
    }*/

}