export default ({children, isLoaded}) => isLoaded? children: (
    <img src="/assets/content/loading.gif" alt="loading"/>
)