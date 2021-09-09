package com.springgroot.jpademo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class IndexController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Model model) {
        // this attribute will be available in the view index.html as a thymeleaf variable
        // model.addAttribute("eventName", "XXXX");
        // this just means render index.html from static/ area
        return "index";
    }
}


// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/")
// public class IndexController {

//     @GetMapping
//     public String sayHello() {
//         // return "OK! You can create a new note by making a POST request to /api/notes endpoint.";
//         return "OK! You can create a new Note by making a POST request with param {title, content} to /api/notes endpoint.";
//     }
// }