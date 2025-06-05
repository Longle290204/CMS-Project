import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./router/router";

function App() {
   return (
      <Router>
         <Routes>
            {publicRoutes.map((route, index) => {
               const Page = route.element;
               let Layout = DefaultLayout;
               if (route.layout === null) {
                  Layout = Fragment;
               } else if (route.layout) {
                  Layout = route.layout;
               }

               return (
                  <Route
                     path={route.path}
                     key={index}
                     element={
                        <Layout>
                           <Page />
                        </Layout>
                     }
                  />
               );
            })}
         </Routes>
      </Router>
   );
}

export default App;
