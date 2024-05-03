import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PageContextProvider} from "./providers/PageContextProvider";
import {LoadingLayerProvider} from "./providers/LoadingLayerProvider";
import {ErrorPage} from "./pages/ErrorPage";
import {AppLayout} from "./layouts/AppLayout";


import '@astoniq/loam-styles/scss/normalized.scss'

function App() {

    return (
        <BrowserRouter>
            <PageContextProvider>
                <Routes>
                    <Route element={<LoadingLayerProvider/>}>
                        <Route element={<AppLayout/>}>
                            <Route path="*" element={<ErrorPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </PageContextProvider>
        </BrowserRouter>
    )
}

export default App
