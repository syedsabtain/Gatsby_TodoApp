const dotenv = require('dotenv')
dotenv.config()

const {gql, ApolloServer} = require('apollo-server-lambda')
const faunadb = require('faunadb')
const q = faunadb.query

const adminClient = new faunadb.Client({secret:process.env.FAUNADB_KEY})



const typeDefs = gql`

type Information{
    
    TodoData:String!

}
input todoinput{
        text:String!,
        check:Boolean!


}
input deletinput{
    ref:String!
}
input checkinput{
    text:String!,
    check:Boolean!,
    ref:String!
}
type Mutation {

    addTodo(input:todoinput):Information! ,
    deleteTodo(input:deletinput):Information!,
    checkTodo(input:checkinput):Information!
}
type Query {
    
    Data:[Information]
}
`


const resolvers={

    Query:{
        Data:async()=>{
            
            const data=[]
            try {
                
                 const result = await adminClient.query(
                  q.Map(
                      q.Paginate(q.Documents(q.Collection('Grahpql_Todo'))),
                      q.Lambda(x=>q.Get(x))
                  )
                 )
               const val = await JSON.stringify(result);
               data.push({
                   
            
    
                TodoData:val,
            
               })
               
               
            } catch (error) {
                
            }
           
            return data
        }
    },
    Mutation:{
        addTodo:async(e,{input})=>{

            try {
                const result = await adminClient.query(

                    q.Create(
                        q.Collection('Grahpql_Todo'),
                        {data:{text:input.text,check:input.check}}
                    )
                )
            } catch (error) {
                
            }
            console.log(input,'grahpserver')
            return {
                TodoData:"Success"
            }
        },
        deleteTodo:async(e,{input})=>{
            try {
                
                const result = await adminClient.query(
                    q.Delete(
                        q.Ref(q.Collection('Grahpql_Todo'),input.ref)
                    )
                )

            } catch (error) {
                
            }
            return {
                TodoData:'Success'
            }
        },
        checkTodo:async(e,{input})=>{
            
            try {
                const result = await adminClient.query(
                    q.Update(
                        q.Ref(q.Collection('Grahpql_Todo'),input.ref),
                        {data:{text:input.text,check:input.check}}
                    )
                )
            } catch (error) {
                
            }
            return{
                TodoData: 'Success'
            }
        }

    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

exports.handler = server.createHandler();