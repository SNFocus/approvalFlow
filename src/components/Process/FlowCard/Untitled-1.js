const res = {
    code: 0,
    data: {
        lines: '20路,301路,5路,地铁5号线,机场大巴线,107路,机场快轨',
        lineids: 'lzbd,lwes,lxid,lwic,lwdf,ldfx,loin',
        linedetails: {
            lwdf: {
                name: '机场大巴线'
            },
            lwes: {
                name: '301路'
            },
            lwic: {
                name: '地铁5号线'
            },
            ldfx: {
                name: '107路'
            },
            lzbd: {
                name: '20路'
            },
            lxid: {
                name: '5路'
            },
            loin: {
                name: '机场快轨'
            }
        }
    }
}

function parse(params) {
    const linedetails = params.data.linedetails
    const normal = []
    const under = []
    const others = []
    for (key in linedetails) {
        const detail = linedetails[key]
        const name = detail.name
        if (/\d+路/.test(name)) {
            normal.push({[key]: detail})
        } else if (name.indexOf('地铁') > -1) {
            under.push({[key]: detail})
        } else {
            others.push({[key]: detail})
        }
    }
    const getName = a => {
        for (let key in a) {
            return a[key]['name']
        }
    }
    const matchNum = a => getName(a).match(/\d+/)[0]
    const sortFn = (a, b) => matchNum(a) - matchNum(b)
    return normal.sort(sortFn)
        .concat(under.sort(sortFn))
        .concat(others.sort((a, b) => getName(a).length - getName(b).length))
}




parse(res)