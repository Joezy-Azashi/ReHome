export default function PasswordStrengthIndicator({ score }) {
    let strColor;
    let strWidth;

    switch (score) {
        case 1:
            strColor = 'red';
            strWidth = '20%';
            break;
        case 2:
            strColor = 'orange';
            strWidth = '40%';
            break;
        case 3:
            strColor = 'yellow';
            strWidth = '60%';
            break;
        case 4:
            strColor = '#5cff47';
            strWidth = '80%';
            break;
        case 5:
            strColor = 'green';
            strWidth = '100%';
            break;
        default:
    }

    let style = { backgroundColor: strColor, height: '0.313rem', width: strWidth, transition: 'all 300ms ease-in-out' }

    return (
        <div>
            <div className="flex justify-between text-[13px]">
                <div className="weak">Weak</div>
                <div className="v-strong">Very Strong</div>
            </div>
            <div style={style} />
        </div>
    )
}