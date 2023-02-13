const PageButton = ({ pg, offset, setOffset }) => {
    return <button className={offset===pg ? 'buttonactive' : 'pagebutton'} onClick={() => setOffset(pg)}>{pg + 1}</button>
}

export default PageButton