<?php

namespace KnitPay\Gateways\Fiserv\Lib;

class Utility {

	public static function getFeatures() {
		// removed installments for india 
		// enabled card function for all resellers
		return [
			'ind' => [
				'icici' => [
					'plugin_name'           => 'First Data Gateway - ICICI Merchant Services',
					'reseller_name'         => 'ICICI Merchant Services',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/icici.jpg",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact ICICI Merchant Services Support:',
					'contact_support'       => 'Telephone number: 1800 102 1673</br>Email: ipghelpdesk@icicims.com</br>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'RU'          => 'RuPay',
						'netbanking'  => 'Netbanking (India)',
						'masterpass'  => 'MasterPass',
						'indiawallet' => 'Local Wallets India',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
				'idfc'  => [
					'plugin_name'           => 'IDFC Bank',
					'reseller_name'         => 'IDFC',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/idfc.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact IDFC Bank Services Support:',
					'contact_support'       => 'Telephone number: 1800 102 1673</br>Email: idfcbankpghelpdesk@firstdata.com</br>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'RU'          => 'RuPay',
						'netbanking'  => 'Netbanking (India)',
						'masterpass'  => 'MasterPass',
						'indiawallet' => 'Local Wallets India',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
			],
			'arg' => [
				'posnet' => [
					'plugin_name'           => 'ePosnet',
					'reseller_name'         => 'ePosnet',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/e-posnet.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Para dudas, consultas o revisiÃƒÂ³n de estados de trÃƒÂ¡mites, puede contactarse con nosotros de las siguientes formas:',
					'contact_support'       => "TelÃƒÂ©fono desde Capital Federal y GBA:</br>(011) 4126-3000 Ã¢â‚¬â€œ de Lunes a Viernes de 9 a 21hs TelÃƒÂ©fono desde el Interior del paÃƒÂ­s:</br>0810-999-7676 Ã¢â‚¬â€œ de Lunes a Viernes de 9 a 21hs Completando el formulario online: <a href='http://www.posnet.com.ar/atencion'>http://www.posnet.com.ar/atencion</a>",
					'produrl'               => 'https://www5.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www5.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
			],
			'col' => [
				'pagogo' => [
					'plugin_name'           => 'Plataforma Pago Go',
					'reseller_name'         => 'Pago Go',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/pagogo.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => ' ',
					'contact_support'       => ' ',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'no',
					'instalments'           => 'yes',
					'secure_pay'            => 'no',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'no',
					'card_type'             => 'yes',
				],
			],
			'bra' => [
				'bin'     => [
					'plugin_name'           => 'Plugin FD',
					'reseller_name'         => 'Bin',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/bin.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => ' ',
					'contact_support'       => '3004-2017  para capitais ou </br>0800 757 1017 para as demais regiÃƒÂµes  - HorÃƒÂ¡rio de atendimento: </br>de segunda ÃƒÂ s sextas-feiras das 09h ÃƒÂ s 20h ou pelo </br>e-mail: solicitacaoespecial@firstdatacorp.com.br',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'M'         => 'MasterCard',
						'V'         => 'Visa',
						'MA'        => 'Maestro',
						'CA'        => 'Cabal',
						'SO'        => 'Sorocred',
						'hipercard' => 'HIPER/HIPERCARD',
						'EL'        => 'ELO',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
				'sipag'   => [
					'plugin_name'           => 'Plugin FD',
					'reseller_name'         => 'SiPag',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/sipag.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => ' ',
					'contact_support'       => '3004-2013  para capitais ou </br>0800 757 1013 para as demais regiÃƒÂµes  - HorÃƒÂ¡rio de atendimento: </br>de segunda ÃƒÂ s sextas-feiras das 09h ÃƒÂ s 20h ou pelo </br>e-mail: solicitacaoespecial@firstdatacorp.com.br',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'M'         => 'MasterCard',
						'V'         => 'Visa',
						'MA'        => 'Maestro',
						'CA'        => 'Cabal',
						'SO'        => 'Sorocred',
						'hipercard' => 'HIPER/HIPERCARD',
						'EL'        => 'ELO',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
				'sicredi' => [
					'plugin_name'           => 'Plugin FD',
					'reseller_name'         => 'Sicredi',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/sicredi.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => ' ',
					'contact_support'       => '3003-7828  para capitais ou </br>0800 7287828 para as demais regiÃƒÂµes  - HorÃƒÂ¡rio de atendimento: </br>de segunda ÃƒÂ s sextas-feiras das 09h ÃƒÂ s 20h ou pelo </br>e-mail: solicitacaoespecial@firstdatacorp.com.br',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'M'         => 'MasterCard',
						'V'         => 'Visa',
						'MA'        => 'Maestro',
						'CA'        => 'Cabal',
						'SO'        => 'Sorocred',
						'hipercard' => 'HIPER/HIPERCARD',
						'EL'        => 'ELO',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
			],
			'mex' => [
				'firstdatamexico' => [
					'plugin_name'           => 'Fiserv Gateway',
					'reseller_name'         => 'Fiserv Mexico',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda.png",
					// "logo" => array('logo1'=>WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda.png",'logo2'=>WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda_amex.png"),
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => __( 'Support:', 'woocommerce-firstdata' ),
					'contact_support'       => '24hrs: 55 11020660<br />helpdeskmx@firstdata.com',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'M'           => 'MasterCard',
						'V'           => 'Visa',
						'MA'          => 'Maestro',
						'A'           => 'American Express',
						'mexicoLocal' => 'MEXICOLOCAL',
						'masterpass'  => 'Masterpass',
					],
					'dynamic_merchant_name' => 'no',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
				'scotiapos'       => [
					'plugin_name'           => 'ScotiaPOS',
					'reseller_name'         => 'ScotiaPOS',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/scotiapos.png",
					// "logo" => array('logo1'=>WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/scotiapos.png",'logo2'=>WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/scotiapos_amex.png"),
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => __( 'Support:', 'woocommerce-firstdata' ),
					'contact_support'       => '24hrs: 55 11020660<br />helpdeskmx@firstdata.com',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'M'           => 'MasterCard',
						'V'           => 'Visa',
						'MA'          => 'Maestro',
						'A'           => 'American Express',
						'mexicoLocal' => 'MEXICOLOCAL',
						'masterpass'  => 'Masterpass',
					],
					'dynamic_merchant_name' => 'no',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
			],
			'gbr' => [
				'first_data_uk'  => [
					'plugin_name'           => 'First Data Gateway - UK',
					'reseller_name'         => 'First Data UK',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fdtm.jpg",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data U.K. Support:',
					'contact_support'       => 'Telephone number: +44 (0) 345 606 5055, Option 2</br>Email: FDHelpdesk@firstdata.com</br>Opening Hours: 8am - 9pm, Monday to Saturday (excluding UK Public Holidays)',
					'produrl'               => 'https://www.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'paypal'     => 'PayPal',
						'masterpass' => 'MasterPass',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
				'lloyds_cardnet' => [
					'plugin_name'           => 'Lloyds Bank Online Payments',
					'reseller_name'         => 'Lloyds Cardnet',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/lloyds.jpg",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact Lloyds Cardnet Support:',
					'contact_support'       => 'Telephone number: +44 (0) 1268 567 100</br>Opening Hours: 8am - 9pm, Monday to Saturday',
					'produrl'               => 'https://www.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'paypal' => 'PayPal',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'irl' => [
				'aib_merchant_services' => [
					'plugin_name'           => 'AIB Merchant Services - Authipay',
					'reseller_name'         => 'AIB Merchant Services',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/aib.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact AIB Merchant Services Support:',
					'contact_support'       => 'Telephone number (IRL): 1850 200 417 or +44 1268 567121 (from outside Ireland)</br>Telephone number (GB): 0371 200 1436 or +44 1268 567123 (from outside Ireland)</br>Email: authipay@aibms.com',
					'produrl'               => 'https://www.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'paypal'     => 'PayPal',
						'masterpass' => 'MasterPass',
						'ideal'      => 'iDEAL',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'nld' => [
				'european_merchant_services' => [
					'plugin_name'           => 'EMS eCommerce Gateway',
					'reseller_name'         => 'European Merchant Services',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/ems.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => 'Are you already a customer',
					'customer_detail'       => "If you are already registered as an EMS merchant then please enter the credentials and settings below. </br>For new customers please follow the link below to acquire an EMS merchant account.</br></br><b>Becoming an EMS customer</b></br>Get a merchant account via this link: <a href='https://www.emspay.eu/en/request-an-offer'>https://www.emspay.eu/en/request-an-offer</a>",
					'contact_support_title' => 'Contact EMS Support',
					'contact_support'       => "Visit the FAQ: </br><a href='http://www.emspay.eu/en/customer-service/faq'>http://www.emspay.eu/en/customer-service/faq</a></br></br>Contact information:</br>Telephone number: 0800 711 88</br>Mon-Wed: 08.30-18.00 hrs</br>Thu & Fri: 08.30-19.00 hrs</br>Email: contact@be.emspay.eu",
					'produrl'               => 'https://www.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'ideal'      => 'iDEAL',
						'klarna'     => 'Klarna',
						'paypal'     => 'PayPal',
						'masterpass' => 'MasterPass',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'deu' => [
				'first_data_telecash' => [
					'plugin_name'           => 'First Data Gateway - TeleCash',
					'reseller_name'         => 'First Data Telecash',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fd-telecash.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data TeleCash Support:',
					'contact_support'       => 'Telephone number: +49 (0) 180 6 2255 8844</br>Email: internet.support@telecash.de',
					'produrl'               => 'https://www.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www.ipg-online.com/ipgapi/services',
					'local_payment'         => [
						'paypal'  => 'PayPal',
						'sofort'  => 'SOFORT Banking (ÃƒÅ“berweisung)',
						'giropay' => 'Giropay',
					],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'no',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'sgp' => [
				'first_data_singapore' => [
					'plugin_name'           => 'First Data Gateway - Singapore',
					'reseller_name'         => 'First Data Singapore',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data Singapore Support:',
					'contact_support'       => 'Telephone number: +65 6622 1888</br>Email: FDgateway.techsupport@Firstdata.com</br>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'hkg' => [
				'first_data_hong_kong' => [
					'plugin_name'           => 'First Data Gateway - Hong Kong',
					'reseller_name'         => 'First Data Hong Kong',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data Hong Kong Support:',
					'contact_support'       => 'Telephone number: +852 3071 5008</br>Email: FDgateway.techsupport@Firstdata.com</br>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
				'citic'                => [
					'plugin_name'           => 'CITIC bank',
					'reseller_name'         => 'CITIC bank',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/citic.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data CITIC Support: ',
					'contact_support'       => 'Telephone number: 1800 243 444<br/>Email: FirstDataGateway@firstdata.com<br/>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'mys' => [
				'first_data_malaysia' => [
					'plugin_name'           => 'First Data Gateway - Malaysia',
					'reseller_name'         => 'First Data Malaysia',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data Malaysia Support:',
					'contact_support'       => 'Telephone number: +60 3 6207 4888</br>Email: FDgateway.techsupport@Firstdata.com</br>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'aus' => [
				'first_data_australia' => [
					'plugin_name'           => 'First Data Gateway - Australia',
					'reseller_name'         => 'First Data Australia',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/fda.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data Austalia Support: ',
					'contact_support'       => 'Telephone number: 1800 243 444</br>Email: ipgsupport@firstdata.com.au</br>Opening Hours: 24/7',
					'produrl'               => 'https://www.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'yes',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'yes',
					'refunds'               => 'yes',
					'card_type'             => 'yes',

				],
			],
			'phl' => [
				'rbs' => [
					'plugin_name'           => 'Robinsons Bank',
					'reseller_name'         => 'Robinsons Bank',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/rbs.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Contact First Data Robinsons Support: ',
					'contact_support'       => 'Telephone number: 1800 243 444<br/>Email: FirstDataGateway@firstdata.com<br/>Opening Hours: 24/7',
					'produrl'               => 'https://www4.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www4.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'yes',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
			],
			'pan' => [
				'banco_general' => [
					'plugin_name'           => 'Banco General',
					'reseller_name'         => 'Banco General',
					// "logo" => WC_HTTPS::force_https_url(WC_FIRSTDATA_PLUGIN_URL) . "/assets/images/bg.png",
					'description'           => 'Pay securely with',
					'customer_detail_title' => ' ',
					'customer_detail'       => ' ',
					'contact_support_title' => 'Soporte a Comercios:',
					'contact_support'       => 'Support email: atención-pos@bgeneral.com</br>Support Number: 800-5000 option 4</br>7:00 am a 9:00 pm',
					'produrl'               => 'https://www2.ipg-online.com/connect/gateway/processing',
					'testurl'               => 'https://test.ipg-online.com/connect/gateway/processing',
					'apiurl'                => 'https://test.ipg-online.com/ipgapi/services',
					'prodapiurl'            => 'https://www2.ipg-online.com/ipgapi/services',
					'local_payment'         => [],
					'dynamic_merchant_name' => 'no',
					'instalments'           => 'no',
					'secure_pay'            => 'yes',
					'dcc_skip_offer'        => 'no',
					'refunds'               => 'yes',
					'card_type'             => 'yes',
				],
			],
		];
	}
}