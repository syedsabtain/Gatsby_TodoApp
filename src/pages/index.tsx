import React, { useEffect, useState } from 'react'
import { useMutation, useQuery} from '@apollo/client'
import gql from 'graphql-tag'
import {useForm} from 'react-hook-form'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Swal from 'sweetalert2'
import Loader from 'react-loader-spinner'

export default() => {

const {register,errors,handleSubmit,reset} = useForm()
const handleloading=()=>{
    let timerInterval
Swal.fire({
  title: 'Loading',

  timer: 2500,
  timerProgressBar: true,
  willOpen: () => {
    Swal.showLoading()
    timerInterval = setInterval(() => {
      const content = Swal.getContent()
      if (content) {
        const b:any = content.querySelector('b')
        if (b) {
          b.textContent = Swal.getTimerLeft()
        }
      }
    }, 100)
  },
  onClose: () => {
    clearInterval(timerInterval)
  }
})
}

const FETCH_dATA = gql `
{
Data{

TodoData
}
}
`
const ADD_TODO = gql `
mutation addTodo($text:String!,$check:Boolean!){
addTodo(input:{
text:$text,
check:$check
}){
TodoData
}
}
`
const DELETE_TODO= gql`
mutation deleteTodo($ref:String!){
deleteTodo(input:{
ref:$ref
}){
TodoData
}
}
`
const CHECK_TODO= gql`
mutation checkTodo($text:String!,$check:Boolean!,$ref:String!){
checkTodo(input:{
text:$text,
check:$check,
ref:$ref
}){
TodoData
}
}`

interface Tododataa{
data:[{
data:{
check:boolean,
text:string,
},
ref:{
'@ref':{
collection:{},
id:string
}
},
ts:number
}]
}
let[tododata,setTododata] = useState<Tododataa>()
    const {loading, error, data} = useQuery(FETCH_dATA);
    const [addTodo] = useMutation(ADD_TODO)
    const [deleteTodo] = useMutation(DELETE_TODO)
    const [checkTodo] = useMutation(CHECK_TODO)
    const handleChecked= () => {

    const checked = tododata?.data.filter(value=>value.data.check===true)
    return checked?.length

    }
    const handleUnchecked=()=>{
    const unchecked = tododata?.data.filter(value=>value.data.check===false)
    return unchecked?.length
    }
    useEffect(()=>{

    if(loading){
            
    }
    else{
    const result = JSON.parse(data?.Data[0]?.TodoData)
    
    setTododata(result)

    }

    },[loading,data])
    
    const onSubmit = (data)=>{

        handleloading()

                addTodo({
                    variables: {
                    text: data.todotext,
                    check: false
                    },
                    refetchQueries: [
                    {
                    query: FETCH_dATA
                    }
                    ]
                    })
        
    reset()
    }
    const handle_Delete=(refer:string)=>{
        handleloading()

    deleteTodo({
    variables:{
    ref:refer
    },
    refetchQueries:[
    {
    query:FETCH_dATA
    }
    ]
    })
    }
    const handle_Check=(txt:string,chek:boolean,reff:string)=>{
        handleloading()

    checkTodo({
    variables:{
    text:txt,
    check:chek,
    ref:reff
    },
    refetchQueries:[{query:FETCH_dATA}]
    })

    }
    return (
    <div className='container text-center mt-5'>
        <Header></Header>
        <div className='row d-flex justify-content-center'>
            <div className='col-md-6 mt-5 bgdiv  shadow-lg'>
                <h1>Todo App</h1>
                <h6>( Build Using Gatsby , Netlify , FaunaDB , GraphQl )</h6>
                <h6>Checked Todo's : {handleChecked()}</h6>
                <h6>UnChecked Todo's : {handleUnchecked()}</h6>
                
                <form className='mb-3 mt-3' onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">

                        <input type="text" className="form-control" name='todotext' ref={register({required:true,minLength:'3',pattern:/^\s*(.*\S)\s*$/})} />
                        {errors.todotext && errors.todotext.type ==='required' && (<h6 className='mt-3'>This Field is
                            Required</h6>)}
                        {errors.todotext && errors.todotext.type ==='minLength' && (
                            <h6 className='mt-3'>MinLength Allowed is  3</h6>
                        )}
                        {errors.todotext && errors.todotext.type ==='pattern' && (
                            <h6 className='mt-3'>Only Whitespaces Are Not Allowed</h6>
                        )}
                       
                    </div>

                    <button type="submit" className="btn btn-primary">Add</button>
                </form>
                <ul className="list-group ultag">
                    {loading ? (
                    <div className='row d-flex justify-content-center'>
                     
                        <Loader
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000} //3 secs
      />
                    </div>
                    ) :(
                    <>
                        {tododata?.data.map((value,key)=>{
                        return(
                        <li key={key} className="list-group-item list-group-item-action d-flex justify-content-between listitem">
                            <span>{value.data.text}</span>
                            <span>{value.data.check ? (<i className="far fa-check-square btn checkbgg"
                                    data-toggle="tooltip" data-placement="top" title="UnCheck This Todo"
                                    onClick={()=>{handle_Check(value.data.text,!value.data.check,value.ref["@ref"].id)}}></i>):
                                (<i className="far fa-square  btn checkbg " data-toggle="tooltip"
                                    data-placement="top" title="Check This Todo"
                                    onClick={()=>{handle_Check(value.data.text,!value.data.check,value.ref["@ref"].id)}}></i>)}
                                <i className="far fa-window-close btn iconbg" data-toggle="tooltip" data-placement="top"
                                    title="Delete" onClick={()=>{handle_Delete(value?.ref["@ref"].id)}}></i></span></li>
                        )
                        })}</>
                    )}

                </ul>
            </div>
        </div>
        <Footer></Footer>

    </div>
    )
    }