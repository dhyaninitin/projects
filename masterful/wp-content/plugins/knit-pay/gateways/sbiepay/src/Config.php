<?php

namespace KnitPay\Gateways\SBIePay;

use Pronamic\WordPress\Pay\Core\GatewayConfig;

/**
 * Title: SBIePay Config
 * Copyright: 2020-2022 Knit Pay
 *
 * @author  Knit Pay
 * @version 5.7.0
 * @since   5.7.0
 */
class Config extends GatewayConfig {
	public $merchant_id;

	public $encryption_key;
}
