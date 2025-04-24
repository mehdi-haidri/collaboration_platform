import React from 'react'
import {  useRoutes } from 'react-router-dom'
import Dashboard from '../Dashboard'
import CodeEditor from '../CodeEditor'
import TextEditor from '../TextEditor'


export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Dashboard />,
        },
        {
            path: '/Codeeditor/:id',
            element: <CodeEditor />,
        },
        {
            path: '/TextEditor/:id',
            element: <TextEditor />,
        },
       
    ])
}