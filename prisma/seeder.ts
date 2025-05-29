import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
const prisma = new PrismaClient();  

async function main() {
    await prisma.user.create({
        data:{
            username:"admin",
            email:"admin123@gmail.com",
            password:"admin123",
        }
    })
    const user = await prisma.user.findFirstOrThrow();

    await prisma.item.createMany({data:[
        {
            name:"Notebook",
            price: 2.99,
        },{
            name:"Instant Noodle",
            price: 0.99,
        }
    ]})

    const items = await prisma.item.findMany();

    await prisma.transaction.create({
        data:{
            user_id: `${user.id}`,
        }
    })

    const transaction = await prisma.transaction.findFirstOrThrow();
    let subtotal = new Decimal(0);
    items.forEach(item => {
        subtotal = new Decimal(2).mul(item.price).plus(subtotal)
        prisma.transactionItem.create({
            data:{
                transaction_id: transaction.id,
                item_id: item.id,
                amount: 2,
                subtotal: new Decimal(2).mul(item.price)
            }
        })
    });

    await prisma.transaction.update({
        where:{id:transaction.id},
        data:{
            total: subtotal
        }
    })

}
main()