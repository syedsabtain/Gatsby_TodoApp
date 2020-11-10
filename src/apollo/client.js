import fetch from 'cross-fetch'
import {InMemoryCache,HttpLink, ApolloClient} from '@apollo/client'


export const client = new ApolloClient({
    link: new HttpLink({
        uri:'/.netlify/functions/todo_graphql',
        fetch
    }),
    cache: new InMemoryCache()
})