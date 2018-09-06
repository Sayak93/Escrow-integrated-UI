export class Property {
    constructor(public _id:String,public title:String,public location:String,public price:number,public contact:number){

    }
}
export class Buyer{
    constructor(private _id:String,private name:String,private balance:number){

    }
}
export class Notification{
    constructor(private createdAt:String,private from:String,private to:String, private heading:String,private content:String,private unread:boolean,private approved:boolean,private readOnly:boolean){
    }
}
export class BT{
    constructor(public from:string,public to:string,public amount:number){
    }
}
export class TransactionState{
    constructor(private _id:String,private title:Property,private buyer:Buyer,private SA:boolean,private EA:boolean,private RL:boolean,private TR:boolean,private RM:boolean){
    }
}
export class TransactionPhase{
    constructor(public _id:String,public property:Property,public tp:Number){
    }
}

export class Transactions{
    constructor(public tType:String,public tId:String,public user:String,public description:String,public createdAt:number,public property:Property){

    }
}



// export var properties:Property[]=[
//     {
//         _id:'1',
//         title:'ITC Infotech',
//         location:'Bangalore',
//         price:500000,
//         contact:8436690126
//     },
//     {
//         _id:'2',
//         title:'Sayak home',
//         location:'Kolkata',
//         price:9000000,
//         contact:8436690126
//     }
// ]
