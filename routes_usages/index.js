const fs = require('fs');
const path = require('path');
const express = require('express')
const mainRouter = express.Router()

const isJSFile = (filename) => (path.extname(filename) === ".js")
const isDirectory = (filename) => (path.extname(filename) === "")

const root = __dirname + '/../routes'
const preUsages = require('./config') // define router usages before using the actual routes (optional)
const logRoutes = true

let routes = []
function getApplicationRoutes(currDirectoryPath = root, prefix = "") {
    fs.readdirSync(currDirectoryPath).forEach((file) => {
        let newDirectoryPath = path.resolve(`${currDirectoryPath}/${file}`)
        if (isJSFile(file)) { // add router
            if (logRoutes) console.log(`${prefix} (${file})`)
            routes.push({ prefix, path: require(newDirectoryPath) })
        }
        else if (isDirectory(file)) { // nested directory
            if (file.startsWith('$')) file = null // for route params
            let newPrefix = prefix + (file ? `/${file}` : "")
            getApplicationRoutes(newDirectoryPath, newPrefix)
        }
    })
    if (logRoutes) console.log(`----------------------------`)
}

let customExpressRoutes = []
function applyPreConfigurationOnRoutes() {
    Object.keys(preUsages || {}).forEach(key => {
        // custom router that has pre configured logic
        let useCustomRouter = false
        let customRouter = express.Router()

        // use pre usage routes before the child routes
        if (Array.isArray(preUsages[key])) preUsages[key].forEach(route => customRouter.use(key, route))
        else customRouter.use(key, preUsages[key])

        routes.forEach(route => {
            // if the pre config related to that route, then apply the pre config before the use of the child routes
            if (route.prefix.startsWith(key)) {
                // console.log(`match ${route.prefix} starts with ${key}`)
                customRouter.use(route.prefix, route.path)
                route['custom'] = useCustomRouter = true
            }
        })
        if (useCustomRouter) customExpressRoutes.push(customRouter)
    })
}

function useRoutes() {
    routes.forEach(route => { if (!route.custom) mainRouter.use(route.prefix, route.path) })
    customExpressRoutes.forEach(expressRouter => mainRouter.use(expressRouter))
}

getApplicationRoutes() // gets all application routes (endpoints)
applyPreConfigurationOnRoutes() // apply pre configuration for specified routes in 'preUsages'
useRoutes() // use the routes defined in the app

module.exports = mainRouter