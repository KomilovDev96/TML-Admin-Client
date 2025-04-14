import styled from "styled-components";

const LoginStyle = styled.div`
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;    
    form{
        border: 2px solid black;
        padding: 10px;
        border-radius: 10px;
    }
    img{
        display: block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin: 0 auto;
        margin-bottom: 20px;


    }

`
const LotiFiy = styled.div`
    width: 50%;
`
export  {LotiFiy, LoginStyle};