const tempInstallMeta = () => {
      return '<div class="etm-install-meta">\n' +
        '        <h5 class="title">Please Install MetaMask to enable blockchain interaction.</h5>\n' +
        '        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1920px-MetaMask_Fox.svg.png" alt="">\n' +
        '      </div>'
    }


    const tempUnlockMeta = () => {
      return '<div class="etm-install-meta unlock">\n' +
        '        <h5 class="title">Your wallet isnt accessible. Please connect with metamask</h5>\n' +
        '        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1920px-MetaMask_Fox.svg.png" alt="">\n' +
        '        <div class="etm-action"><button class="etm-btn connect js-connectToMetamask">Connect with your wallet</button></div>\n' +
        '      </div>'
    }

    const tempAmountSelect = () => {
      return ' <select class="etm-amount-select" name="" id="">\n' +
          '          <option value="1" selected>1</option>\n' +
          '          <option value="2">2</option>\n' +
          '          <option value="3">3</option>\n' +
          '          <option value="4">4</option>\n' +
          '          <option value="5">5</option>\n' +
          '          <option value="6">6</option>\n' +
          '          <option value="7">7</option>\n' +
          '          <option value="8">8</option>\n' +
          '          <option value="9">9</option>\n' +
          '          <option value="10">10</option>\n' +
          '        </select>'
  }

    const tempMetaIsSuccess = (address, product = {}) => {
      return ' <div class="etm-successMeta">\n' +
        '          <div class="etm-con-address">\n' +
        '            <h5>Your Wallet Address</h5>\n' +
        '            <p>'+ address +'</p>\n' +
        '          </div>\n' +
        '         <div class="etm-buy-btn">\n' +
        '           <label for="emt_amount">Select Amount</label>\n' +
        '            <select class="etm-amount-select" name="" id="emt_amount">\n' +
        '              <option value="1" selected="">1</option>\n' +
        '              <option value="2">2</option>\n' +
        '              <option value="3">3</option>\n' +
        '              <option value="4">4</option>\n' +
        '              <option value="5">5</option>\n' +
        '              <option value="6">6</option>\n' +
        '              <option value="7">7</option>\n' +
        '              <option value="8">8</option>\n' +
        '              <option value="9">9</option>\n' +
        '              <option value="10">10</option>\n' +
        '            </select>\n' +
        '         </div> \n' +
        '          <div class="etm-info">\n' +
        '            <p><strong>Characters are available for purchase through our <a href="#">sales smart\n' +
        '                  contract</a>.</strong></p>\n' +
        '            <p>\n' +
        '              When clicking "Buy Character", you\'ll be asked to confirm your transaction. Once confirmed, the network may\n' +
        '              take a few minutes to process it.\n' +
        '            </p>\n' +
        '            <p>\n' +
        '              Once processed, you\'ll be added to our random distribution list. After the tokensale is over you will\n' +
        '               receive your character as a token and you will be able to download the full digital image of your character.\n' +
        '            </p>\n' +
        '          </div>\n' +
        '          <div class="etm-line"></div>\n' +
        '          <div class="etm-basket tx-right">\n' +
        '            Total <br> <b><span class="emt-total-price">0.2</span> ETH</b>\n' +
        '          </div>\n' +
        '          <div class="etm-line"></div>\n' +
        '          <div class="etm-buy-btn tx-right">\n' +
        '            <button class="etm-btn pay js-send-request">Buy Character(s)</button>\n' +
        '          </div>\n' +
        '        </div>'
    }


    const init = () => {

      const ethereum = window.ethereum;

      if (ethereum === undefined) {
        $('.etm-connectingInfo').html(tempInstallMeta())
      } else {


        // metamask is installed

        ethereum.request({ method: 'eth_accounts' })
          .then(res => {
            if (res.length > 0) {
              // current address
              console.log('current address', res[0])
              actionByStatus('success', { address: res[0] })
            } else {
              console.log('no adress aviable')
              actionByStatus('no_meta_connection')
            }
          })


        // Bir web3 sitesinin kullanıcının hesaplarına erişip erişemeyeceğini kontrol eder
        const providerStatus = ethereum.isConnected();

        const providerStatusObj = {
          text: providerStatus ? 'Provider is connected' : 'Provider is not connected',
          color: providerStatus ? '#20867c' : 'red'
        }

        $('.etm-provider-status').text(providerStatusObj.text).css('color', providerStatusObj.color)


        // events

        ethereum.on('chainChanged', (_chainId) => window.location.reload());

        ethereum.on('message', (message) => {
          alert(message)
        });

        ethereum._metamask.isUnlocked()
          .then(res => {
            console.log('is unlocked', res)
          })

        ethereum.on('connect', account => {
          console.log('on connect', account)
        })

        ethereum.on('disconnect', account => {
          console.log('on disconnect', account)
        })

        ethereum.on('accountsChanged', function (accounts) {
          // Time to reload your interface with accounts[0]!
          // logged address
          console.log('accountsChanged', accounts)
          if (accounts === undefined || (accounts.length === 0)) {
            // Bağlanmamış
            actionByStatus('no_meta_connection')
            console.log('no connect to meta', accounts)
          } else {
            // Bağlanmış ve adressi
            console.log('accounts reload', accounts[0])
            actionByStatus('success', { address: accounts[0] })
          }
        })

      }

      // etm-connectingInfo
    };


    const actionByStatus = (status = null, obj) => {
      if (status === null) return;

      if (status === 'success') {
        $('.etm-connectingInfo').html(tempMetaIsSuccess(obj.address))
      }

      if (status === 'no_meta_connection') {
        $('.etm-connectingInfo').html(tempUnlockMeta())
      }
    }


    const connectToMetaMask = async () => {
      console.log('connectToMetaMask')
      web3 = new Web3(window.ethereum)
      window.ethereum.enable()
        .then(res => {
          alert('connecting successfull', res)
        })
        .catch(error => {
          // User denied account access
          alert('connection failed')
          console.log(error)
        })
    }


    const sendRequest = () => {
      console.log('sendRequest')

      const ethereum = window.ethereum

      let params = [
        {
          from: '0x2507314C9e660eB0cDCeB5c7FDa3eE8248738d78',
          to: '0x2507314c9e660eb0cdceb5c7fda3ee8248738d78',
          gas: '0x76c0', // 30400
          gasPrice: '0x9184e72a000', // 10000000000000
          value: '0x9184e72a', // 2441406250
          data:
            '0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675',
        },
      ]

      ethereum.request({ method: 'eth_accounts' })
        .then(res => {
          if (res.length > 0) {
            // current address

            params.from = res[0];
            params.to = $('.js-to-address').val();

            console.log('params', params)

            setTimeout(() => {
              ethereum.request({
                method: 'eth_sendTransaction',
                params,
              })
                .then((result) => {
                  console.log('success', result);
                  alert('transaction success')
                  // The result varies by by RPC method.
                  // For example, this method will return a transaction hash hexadecimal string on success.
                })
                .catch((error) => {
                  console.log('error', error)
                  error.message !== undefined ? alert(error.message) : alert('transaction failed')
                  // If the request fails, the Promise will reject with an error.
                });
            })

          } else {
            console.log('no adress aviable')
            actionByStatus('no_meta_connection')
          }
        })




    }

    $(document).ready(() => {


      init();


      $('body').on('click', '.js-connectToMetamask', () => {
        connectToMetaMask();
      })

      $('body').on('click', '.js-send-request', () => {
        sendRequest();
      })

      $('body').on('change', '.etm-amount-select', () => {
        const amount = $('.etm-amount-select').val()
        const total = parseInt(amount) * 0.2
        $('.emt-total-price').html(total)

      })


    })