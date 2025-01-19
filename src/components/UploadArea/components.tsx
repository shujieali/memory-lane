import { Container, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

export const FileSelectContainer = styled(Container)(
  () => `
    padding-left: 0 !important;
    padding-right: 0px !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 400px;
  `,
)
export const RowContainer = styled(Container)(
  () => `
    padding-left: 0 !important;
    padding-right: 0px !important;
    display: flex;
    justify-content: center;
    padding-top: 12px;
  `,
)
export const CustomizedButton = styled(Button)(
  () => `
    width: 200px;
  `,
)
export const UploadPopOverContainer = styled('div')(
  () => `
    display: flex;
    position: absolute;
    bottom: calc(50% - 300px / 2);
    left: calc(50% - 300px / 2);
    border: 1px solid #dddddd;
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    width: 300px;
    height: 300px;
    justify-content: space-around;
    align-items: center;
    background: #169BDE;
    z-index: 1193;
`,
)
