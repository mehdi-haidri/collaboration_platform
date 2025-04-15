import React from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import Dashboard from '../Dashboard'
import CodeEditor from '../CodeEditor'


export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <Dashboard />,
        },
        {
            path: '/editor/:id',
            element: <CodeEditor />,
        },
       
    ])
}