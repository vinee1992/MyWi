																																																																																																																																																																																															package com.accenture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("com.accenture")
public class MyWizardApplication  extends SpringBootServletInitializer{

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder con) {
		// TODO Auto-generated method stub
		return con.sources(MyWizardApplication.class);
	}
	
	
	public static void main(String[] args) {
		SpringApplication.run(MyWizardApplication.class, args);
	}
}
