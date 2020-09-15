package com.accenture.myWizardController;

import org.slf4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MyWizardController {


			
	@RequestMapping("/sample")
	public String sample() {
		
			return "sample";
	}
}
